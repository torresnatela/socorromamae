import { NextResponse } from "next/server";
import { ulid } from "ulid";

type Meta = {
  requestId: string;
  timestamp: string;
  path: string;
};

export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

type ApiResponse<T> = {
  meta: Meta;
  data?: T;
  error?: ApiErrorPayload;
};

export const respond = <T>(
  path: string,
  options: { data?: T; error?: ApiErrorPayload; status?: number }
) => {
  const { data, error, status = error ? 400 : 200 } = options;

  const body: ApiResponse<T> = {
    meta: {
      requestId: ulid(),
      timestamp: new Date().toISOString(),
      path
    },
    data,
    error
  };

  return NextResponse.json(body, { status });
};
