import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import type { ExplorerOptions } from "./.quartz/plugins" // latest

// Explicitly type the 'node' parameter to satisfy TypeScript
ExternalPlugin.RecentNotes({
  filterFn: (node: { slug: string }) => {
    const omit = new Set(["404", "tags", "index"])
    return !omit.has(node.slug)
  }
})

const sortFn: ExplorerOptions["sortFn"] = (a, b) => {
  // 1. Keep folders on top of files
  if (a.isFolder && !b.isFolder) return -1
  if (!a.isFolder && b.isFolder) return 1

  // 2. Fall back to safely avoid 'undefined', and cast 'as string' to fix the '{}' error
  const nameA = (a.data?.slug ?? a.displayName ?? "") as string
  const nameB = (b.data?.slug ?? b.displayName ?? "") as string

  // 3. Now localeCompare is completely safe to use
  return nameA.localeCompare(nameB, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

ExternalPlugin.Explorer({
  sortFn,
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()