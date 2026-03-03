import clsx from "clsx";
import { useCallback, type FunctionComponent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import type { BoardItem } from "../../types";
import { Config } from "../../config";

import "./CreateBoardItemForm.css";

interface FormValues {
  body: string;
}

const schema = yup
  .object({
    body: yup.string().required(),
  })
  .required();

interface CreateResponse {
  boardItem?: BoardItem | null;
}

interface Props {
  boardId: string;
  onCreate: (item: BoardItem) => void;
}

export const CreateItemForm: FunctionComponent<Props> = ({
  boardId,
  onCreate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const url = new URL("/boardItems/create", Config.serverUrl);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          boardId,
        }),
      });

      if (!response.ok) {
        return;
      }

      const json = (await response.json()) as CreateResponse;
      if (!json || !json.boardItem) {
        return;
      }

      onCreate(json.boardItem);
      reset();
    },
    [boardId],
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="field">
          <div className="control">
            <textarea
              className={clsx("input", "boardItemBody", {
                "is-danger": !!errors.body?.message,
              })}
              {...register("body", {
                required: true,
              })}
              placeholder="Paste something in here"
            />
            {errors.body?.message && (
              <p className="help is-danger">{errors.body.message}</p>
            )}
          </div>
        </div>
        <input className="button is-primary" type="submit" value="Paste" />
      </form>
    </>
  );
};
