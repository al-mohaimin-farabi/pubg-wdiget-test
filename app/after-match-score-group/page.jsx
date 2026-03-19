"use client";

import Layout from "@/components/layout";
import Tableheader from "@/components/Tableheader";
import TableRow from "@/components/TableRow";
import Title from "@/components/Title";
import { useGetAfterMatchScoreGroupQuery } from "@/lib/services/api";

function AfterMatchScoreGroup() {
  const { data } = useGetAfterMatchScoreGroupQuery();
  const teams = data?.data || [];
  const colOne = teams.slice(0, 8);
  const colTwo = teams.slice(8, 16);

  return (
    <Layout top>
      <Title title="Overall Standing" stageOnly data={data?.game[0]} />
      <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
        <div className="mx-auto w-215 space-y-2">
          <Tableheader overall />
          <div className="space-y-2">
            {colOne.map((team) => (
              <TableRow key={team.team_id} team={team} overall />
            ))}
          </div>
        </div>
        <div className="mx-auto w-215 space-y-2">
          <Tableheader overall />
          <div className="space-y-2">
            {colTwo.map((team) => (
              <TableRow key={team.team_id} team={team} overall />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AfterMatchScoreGroup;
