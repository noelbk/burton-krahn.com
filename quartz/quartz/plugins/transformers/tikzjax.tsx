import { QuartzTransformerPlugin } from "../types"

export const TikzJax: QuartzTransformerPlugin = () => {
  return {
    name: "TikzJax",
    externalResources() {
      return {
        additionalHead: [
          // TeX fonts used by TikZJax output
          <link rel="stylesheet" type="text/css" href="https://tikzjax.com/v1/fonts.css" />,
          <style>{`
            .tikz-diagram svg {
              max-width: 100%;
              height: auto;
            }
          `}</style>,
        ],
      }
    },
  }
}

