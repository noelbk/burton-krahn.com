import gzip
import re
import struct
import sys
from collections import defaultdict
from pathlib import Path


ANSI_ESCAPE_RE = re.compile(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])")


def read_pcap_packets(data: bytes):
    if len(data) < 24:
        return

    magic = data[:4]
    if magic == b"\xd4\xc3\xb2\xa1":
        endian = "<"
    elif magic == b"\xa1\xb2\xc3\xd4":
        endian = ">"
    else:
        raise ValueError("unsupported pcap format")

    offset = 24
    while offset + 16 <= len(data):
        ts_sec, ts_usec, incl_len, _orig_len = struct.unpack(
            endian + "IIII", data[offset : offset + 16]
        )
        offset += 16
        packet = data[offset : offset + incl_len]
        offset += incl_len
        yield ts_sec + ts_usec / 1_000_000, packet


def parse_ipv4_tcp(packet: bytes):
    if len(packet) < 14:
        return None
    eth_type = struct.unpack("!H", packet[12:14])[0]
    if eth_type != 0x0800:
        return None

    ip = packet[14:]
    if len(ip) < 20:
        return None
    version_ihl = ip[0]
    version = version_ihl >> 4
    ihl = (version_ihl & 0x0F) * 4
    if version != 4 or len(ip) < ihl + 20:
        return None
    if ip[9] != 6:
        return None

    src_ip = ".".join(str(b) for b in ip[12:16])
    dst_ip = ".".join(str(b) for b in ip[16:20])
    tcp = ip[ihl:]
    src_port, dst_port, seq, _ack, offset_flags = struct.unpack("!HHIIH", tcp[:14])
    data_offset = ((offset_flags >> 12) & 0xF) * 4
    if len(tcp) < data_offset:
        return None
    payload = tcp[data_offset:]
    return src_ip, src_port, dst_ip, dst_port, seq, payload


def strip_telnet(payload: bytes) -> bytes:
    out = bytearray()
    i = 0
    while i < len(payload):
        b = payload[i]
        if b != 255:
            out.append(b)
            i += 1
            continue

        if i + 1 >= len(payload):
            break

        cmd = payload[i + 1]
        if cmd == 255:
            out.append(255)
            i += 2
        elif cmd in (251, 252, 253, 254):
            i += 3
        elif cmd == 250:  # SB ... IAC SE
            i += 2
            while i + 1 < len(payload):
                if payload[i] == 255 and payload[i + 1] == 240:
                    i += 2
                    break
                i += 1
        else:
            i += 2
    return bytes(out)


def clean_text(data: bytes) -> str:
    chars = []
    for b in data:
        if b in (9, 10, 13, 27):
            chars.append(chr(b))
        elif 32 <= b <= 126:
            chars.append(chr(b))
        elif b == 0:
            chars.append("\n")
    text = "".join(chars)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = ANSI_ESCAPE_RE.sub("", text)
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    return text


def reassemble_tcp_stream(segments):
    if not segments:
        return b""

    segments.sort(key=lambda item: item[0])
    out = bytearray()
    cursor = None

    for seq, payload in segments:
        if cursor is None:
            out.extend(payload)
            cursor = seq + len(payload)
            continue

        end_seq = seq + len(payload)
        if end_seq <= cursor:
            continue

        if seq < cursor:
            out.extend(payload[cursor - seq :])
        else:
            out.extend(payload)

        cursor = end_seq

    return bytes(out)


def extract_transcript(path: Path) -> str:
    raw = gzip.open(path, "rb").read() if path.suffix == ".gz" else path.read_bytes()
    flows = defaultdict(list)
    first_seen = {}

    for ts, packet in read_pcap_packets(raw):
        parsed = parse_ipv4_tcp(packet)
        if not parsed:
            continue
        src_ip, src_port, dst_ip, dst_port, seq, payload = parsed
        if not payload:
            continue
        if src_port != 23 and dst_port != 23:
            continue

        if src_port != 23:
            continue

        flow = (src_ip, src_port, dst_ip, dst_port)
        first_seen.setdefault(flow, ts)
        flows[flow].append((seq, payload))

    chunks = []
    for flow, segments in sorted(first_seen.items(), key=lambda item: item[1]):
        raw_stream = reassemble_tcp_stream(flows[flow])
        cleaned = clean_text(strip_telnet(raw_stream))
        if cleaned.strip():
            chunks.append(cleaned)

    return "\n\n".join(chunk.strip() for chunk in chunks if chunk.strip()) + "\n"


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract_telnet_sessions.py INPUT.tcpdump.gz OUTPUT.txt")
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(extract_transcript(src))


if __name__ == "__main__":
    main()
