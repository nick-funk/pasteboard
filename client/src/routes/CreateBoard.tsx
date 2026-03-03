import { useCallback, useState, type FunctionComponent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

import { Config } from "../config";
import type { Board } from "../types";

interface FormValues {
  name: string;
}

interface CreateResponse {
  board?: Board | null;
}

interface MessageState {
  body: string;
  success: boolean;
}

const schema = yup
  .object({
    name: yup.string().required().min(3).trim(),
  })
  .required();

export const CreateBoardPage: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [message, setMessage] = useState<MessageState | null>(null);

  const onSubmit: SubmitHandler<FormValues> = useCallback(async (data) => {
    const url = new URL("/api/boards/create", Config.serverUrl);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    const json = (await response.json()) as CreateResponse;
    if (!json || !json.board) {
      return;
    }

    setMessage({
      success: true,
      body: "Successfully created new board.",
    });

    setTimeout(() => {
      window.location.href = "/boards";
    }, 2000);
  }, []);

  return (
    <>
      <span>Create Board</span>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className={clsx("input", {
                "is-danger": !!errors.name?.message,
              })}
              placeholder="Enter a name for the board"
              {...register("name", {
                required: true,
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              })}
            />
            {errors.name?.message && (
              <p className="help is-danger">{errors.name.message}</p>
            )}
          </div>
        </div>
        <input className="button is-primary" type="submit" value="Create" />
      </form>
      {message && message.success && (
        <article className="message is-success">
          <div className="message-header">
            <p>Success</p>
          </div>
          <div className="message-body">{message.body}</div>
        </article>
      )}
    </>
  );
};
