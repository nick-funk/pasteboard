import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

export const EditBoardPage: FunctionComponent = () => {
  const { id } = useParams();

  return <>
    <span>{id}</span>
  </>
}
