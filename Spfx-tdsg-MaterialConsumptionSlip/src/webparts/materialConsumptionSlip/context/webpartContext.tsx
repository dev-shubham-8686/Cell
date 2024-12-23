import { createContext } from "react";
import { WebPartContext as WebPartContextType } from "@microsoft/sp-webpart-base";

export const WebPartContext = createContext<WebPartContextType | null>(null);
