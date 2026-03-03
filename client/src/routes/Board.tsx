import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

export const BoardPage: FunctionComponent = () => {
  const { id } = useParams();

  return <>
    <span>{id}</span>
  </>
}
