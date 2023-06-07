import { AppStore, AppStoreDispatch } from "@/store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppStoreDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector;
