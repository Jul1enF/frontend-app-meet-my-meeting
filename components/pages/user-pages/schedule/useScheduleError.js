import { useMemo } from "react";
import { dayValidation } from "./scheduleUtils";

export default function useScheduleError(day) {
   return useMemo(()=> dayValidation(day),
   [day])
}