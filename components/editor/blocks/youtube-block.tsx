import { createReactBlockSpec } from "@blocknote/react"

function getYouTubeVideoId(value: string): string | undefined {
  try {
    const url = new URL(value)

    if (url.hostname === "youtu.be") return url.pathname.slice(1) || undefined
    if (!url.hostname.endsWith("youtube.com")) return undefined
    if (url.pathname === "/watch") return url.searchParams.get("v") ?? undefined
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2]
    if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2]
  } catch {
    return undefined
  }

  return undefined
}

export const youtubeBlock = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      url: { default: "" },
      caption: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const videoId = getYouTubeVideoId(block.props.url)

      if (!videoId) {
        return (
          <label className="editor-youtube-input">
            <span>URL do YouTube</span>
            <input
              type="url"
              defaultValue={block.props.url}
              readOnly={!editor.isEditable}
              placeholder="https://www.youtube.com/watch?v=..."
              onBlur={(event) => {
                if (!editor.isEditable) return
                editor.updateBlock(block, {
                  props: { url: event.currentTarget.value.trim() },
                })
              }}
            />
          </label>
        )
      }

      return (
        <figure className="editor-youtube">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={block.props.caption || "Vídeo do YouTube"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {block.props.caption ? <figcaption>{block.props.caption}</figcaption> : null}
        </figure>
      )
    },
  },
)()
