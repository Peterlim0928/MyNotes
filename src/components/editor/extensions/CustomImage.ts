import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "medium",
        parseHTML: (el) => el.getAttribute("data-size") ?? "medium",
        renderHTML: (attrs) => ({ "data-size": attrs.size }),
      },
      align: {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") ?? "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
      "data-src": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-src"),
        renderHTML: (attrs) =>
          attrs["data-src"] ? { "data-src": attrs["data-src"] } : {},
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        "data-size": node.attrs.size,
        "data-align": node.attrs.align,
      }),
    ];
  },
});
