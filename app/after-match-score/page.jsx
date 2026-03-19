"use client";

import HighLightTeam from "@/components/HighLightTeam";
import Layout from "@/components/layout";
import Tableheader from "@/components/Tableheader";
import TableRow from "@/components/TableRow";
import Title from "@/components/Title";
import { useGetAfterMatchScoreQuery } from "@/lib/services/api";

function AfterMatchScore() {
  const { data } = useGetAfterMatchScoreQuery();
  const teamOne = data?.data[0] || [];
  const colOne = data?.data.slice(1, 7) || [];
  const colTwo = data?.data.slice(7, 16) || [];

  return (
    <Layout top>
      <Title title="Match Standing" stageOnly data={data?.game[0]} />
      <div className="wrapper mx-auto grid h-auto! w-full! grid-cols-2 gap-4">
        <div className="mx-auto w-215 space-y-2">
          <HighLightTeam teamOne={teamOne} />

          <Tableheader />
          <div className="space-y-2">
            {colOne.map((team) => (
              <TableRow key={team.team_id} team={team} />
            ))}
          </div>
        </div>
        <div className="mx-auto w-215 space-y-2">
          <Tableheader />
          <div className="space-y-2">
            {colTwo.map((team) => (
              <TableRow key={team.team_id} team={team} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AfterMatchScore;
