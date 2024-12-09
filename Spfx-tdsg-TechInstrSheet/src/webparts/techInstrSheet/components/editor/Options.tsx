import * as React from "react";
import { renderToString } from "react-dom/server";
const names = [
  { key: "Phil Heartman", value: "pheartman" },
  { key: "Gordon Ramsey", value: "gramsey" },
  { key: "Shraddha Hinge", value: "shraddha" },
  { key: "Sudharshan Jagdale", value: "sudharshan" },
  { key: "Manoj Barde", value: "manoj" },
  { key: "Basker Patel", value: "bhaskar" },
  { key: "Naren Nandekar", value: "naren" },
  { key: "Lea Thompson", value: "lea" },
  { key: "Cyndi Lauper", value: "cyndi" },
  { key: "Tom Cruise", value: "tom" },
  {
    key: "Madonna",
    value: "madonna",
  },
];
export const options = {
  trigger: "@",
  values: names,
  lookup: (user: any) => user.key,
  fillAttr: "value",
  allowSpaces: true,
  containerClass: "tribute-container",
  selectClass: "highlight",
  itemClass: "mentionItem",
  selectTemplate: function (item: any) {
    return renderToString(
      <span className="fr-deletable fr-tribute mentionSelected">
        @{item.original.key}
      </span>
    );
  },
};

// Function to convert Blob URL to File
export const blobUrlToFile = (
  blobUrl: string,
  fileName: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    fetch(blobUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a file from the blob
        const file = new File([blob], fileName, { type: blob.type });
        resolve(file); // Resolve the file
      })
      .catch((error) => reject(error));
  });
};
