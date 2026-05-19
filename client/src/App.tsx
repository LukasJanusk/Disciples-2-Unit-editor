import { useEffect, useState } from "react";
import { getUnitsSearchList, UNITS_SEARCH_LIST_CHANGED_EVENT } from "@/api/https";
import { type UnitSearchListItem } from "@/schema/unitSchema";
import Search from "@/components/search/Search";
import Header from "@/components/layout/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/Home";
import { AppRoute } from "@/routes";
import NavigationBar from "@/components/ui/NavigationBar";
import UnitDataListPage from "@/pages/UnitDataList";
import UnitsListPage from "@/pages/UnitList";
import Title from "@/components/ui/Title";
import UnitInfoPage from "./pages/UnitInfo";
import { Toaster } from "sonner";

function App() {
  const [allSearchList, setAllSearchList] = useState<UnitSearchListItem[]>([]);

  useEffect(() => {
    const loadUnitSearchList = async () => {
      try {
        const loadedSearchList = await getUnitsSearchList();
        setAllSearchList(loadedSearchList);
      } catch {
        setAllSearchList([]);
      }
    };

    const handleUnitsSearchListChanged = () => {
      void loadUnitSearchList();
    };

    void loadUnitSearchList();
    window.addEventListener(UNITS_SEARCH_LIST_CHANGED_EVENT, handleUnitsSearchListChanged);

    return () => {
      window.removeEventListener(UNITS_SEARCH_LIST_CHANGED_EVENT, handleUnitsSearchListChanged);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col border overflow-hidden">
      <Toaster />
      <Header>
        <div className="flex items-center justify-between px-4 py-8 ">
          <Title text="Disciples 2 Unit Editor" />
          <Search className="justify-self-center" values={allSearchList.map((unit) => String(unit.name ?? ""))} />
          <NavigationBar />
          <div />
        </div>
      </Header>
      <div className="flex-1 min-h-0 overflow-auto">
        <Routes>
          <Route path={AppRoute.Home} element={<HomePage />} />
          <Route path={AppRoute.Units} element={<UnitsListPage />} />
          <Route path={AppRoute.UnitDetail} element={<UnitInfoPage />} />
          <Route path={AppRoute.UnitData} element={<UnitDataListPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
