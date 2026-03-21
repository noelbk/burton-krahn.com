import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
): Promise<FilePath[]> {
  const fps = (
    await globby(pattern, {
      cwd,
      ignore: ignorePatterns,
      // Quartz runs inside larger repos where the parent `.gitignore`
      // may exclude generated or vendored paths that Quartz still needs
      // to read/copy at build time (e.g. static assets). We rely on
      // `ignorePatterns` for Quartz-specific filtering instead.
      gitignore: false,
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
