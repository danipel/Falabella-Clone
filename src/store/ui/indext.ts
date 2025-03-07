import { create } from "zustand";
import { createSidebarSlice, SidebarSlice } from "./sidebar.slice";
import { devtools } from "zustand/middleware";

type ShareState = SidebarSlice;

export const useUIStore = create<ShareState>()(
  devtools((...a) => ({
    ...createSidebarSlice(...a),
  }))
);
