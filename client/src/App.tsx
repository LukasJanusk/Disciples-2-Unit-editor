import { useEffect, useState } from "react";
import { getUnitsSearchList } from "@/api/https";
import { type Unit } from "@/types";
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

function App() {
  const [allSearchList, setAllSearchList] = useState<Partial<Unit>[]>([]);

  useEffect(() => {
    const getUnitSearchList = async () => {
      try {
        const loadedSearchList = await getUnitsSearchList();
        setAllSearchList(loadedSearchList);
      } catch {
        setAllSearchList([]);
      }
    };

    void getUnitSearchList();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col border overflow-hidden">
      <Header>
        <div className="flex items-center justify-between px-4 py-8 ">
          <Title text="Disciples 2 Unit Editor" />
          <Search className="justify-self-center" values={allSearchList.map((unit) => String(unit.name ?? ""))} />
          <NavigationBar />
          <div />
        </div>
      </Header>
      <div className="flex-1 min-h-0">
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
