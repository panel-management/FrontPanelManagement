import { defineStore } from "pinia";
import type { Belt } from "~/models/sportAndBelt/belt";
import type { Sport } from "~/models/sportAndBelt/sport";
import {
  getAllBeltService,
  getAllSportService,
} from "~/services/sportBelt.service";

export const useGettingVariousDataStore = defineStore(
  "GettingVariousData",
  () => {
    const sportData: Ref<Sport[]> = ref([]);
    const beltData: Ref<Belt[]> = ref([]);
    const sportsLoaded: Ref<boolean> = ref(false);
    const beltsLoaded: Ref<boolean> = ref(false);

    async function fetchSports() {
      if (sportsLoaded.value) return;
      try {
        const result = await getAllSportService();
        console.log(result.data);
        if (result.statusCode === 200) {
          sportData.value = Array.isArray(result.data) ? result.data : [];
          sportsLoaded.value = true;
        }
      } catch (error: any) {
        console.log(error.message || error);
      }
    }

    async function fetchBelts() {
      if (beltsLoaded.value) return;
      try {
        const result = await getAllBeltService();
        console.log(result.data);
        if (result.statusCode === 200) {
          beltData.value = Array.isArray(result.data) ? result.data : [];
          beltsLoaded.value = true;
        }
      } catch (error: any) {
        console.log(error.message || error);
      }
    }

    return {
      sportData,
      beltData,
      fetchSports,
      fetchBelts,
    };
  }
);
