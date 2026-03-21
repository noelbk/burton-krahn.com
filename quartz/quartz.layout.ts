import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import type { Options as ExplorerOptions } from "./quartz/components/Explorer"

const explorerSortLatestFirst: ExplorerOptions["sortFn"] = (a, b) => {
  const aIsFolder = a.isFolder
  const bIsFolder = b.isFolder

  // Put files first so the newest notes are visible immediately
  if (aIsFolder !== bIsFolder) return aIsFolder ? 1 : -1

  const dateMs = (node: any) => {
    const d = node?.data?.date
    if (!d) return -Infinity
    if (typeof d === "number") return d
    const t = Date.parse(typeof d === "string" ? d : String(d))
    return Number.isFinite(t) ? t : -Infinity
  }

  // If both are files, sort newest first by published date
  if (!aIsFolder && !bIsFolder) {
    const dt = dateMs(b) - dateMs(a)
    if (dt !== 0) return dt
  }

  // Fallback: alphabetical (folders and tie-breaks)
  return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ title: "Pages", sortFn: explorerSortLatestFirst }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ title: "Pages", sortFn: explorerSortLatestFirst }),
  ],
  right: [],
}
