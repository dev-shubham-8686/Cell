import * as React from "react";
import type { ITechInstrSheetProps } from "./ITechInstrSheetProps";
import "../../../styles/dist/tailwind.css";
import { ConfigProvider } from "antd";
import { WebPartContext } from "../context/WebPartContext";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import TechnicalInstructionList from "./pages/TechnicalInstructionListIndex/TechnicalInstructionList";
import TechnicalInstructionFrom from "./pages/TechnicalInstructionFormIndex.tsx/TechnicalInstructionForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "../context/userContext";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/code_view.min.js"
// import "froala-editor/js/plugins/font_awesome.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/print.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";
import "froala-editor/css/third_party/spell_checker.min.css";
import "froala-editor/css/plugins/fullscreen.min.css";
import "froala-editor/css/plugins/special_characters.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/file.min.css";
import "froala-editor/css/plugins/code_view.css"

const queryClient = new QueryClient();

const TechInstrSheet: React.FC<ITechInstrSheetProps> = ({
  description,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userDisplayName,
  context,
  userEmail,
}) => {

  const style = { padding: "1rem"};

  document.addEventListener('copy', (e) => {
    if (typeof window !== "undefined" && window !== null) {
      const selection = window.getSelection()?.toString().trim() || ''; // Default to an empty string if selection is undefined
  
      // Check if clipboardData is not null before using it
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', selection);
        e.preventDefault();
      }
    }
  });
  

  return (
    <WebPartContext.Provider value={context}>
       <QueryClientProvider client={queryClient}>
        <UserProvider userEmail={userEmail}>
        <ConfigProvider
          theme={{
            token: {
              colorTextDisabled: "var(--color-disabled-text)",
              colorPrimary: "#c50017",
            },
          }}
        >

        <Router>
            <main className="main-content" style={style}>
              <Routes>
                <Route path="/" element={<TechnicalInstructionList />} />
                <Route path="/form/create" element={<TechnicalInstructionFrom isViewMode={false} />} />
                <Route path="/form/edit/:id" element={<TechnicalInstructionFrom isViewMode={false} />} />
                <Route path="/form/view/:id" element={<TechnicalInstructionFrom isViewMode={true} />} />
              </Routes>
            </main>
          </Router>
        </ConfigProvider>
        </UserProvider>
        </QueryClientProvider>
    </WebPartContext.Provider>
  );
};

export default TechInstrSheet;