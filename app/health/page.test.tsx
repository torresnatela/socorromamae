import React from "react";
import { render, screen } from "@testing-library/react";
import HealthPage from "./page";

describe("HealthPage", () => {
  it("renders static health information", () => {
    render(<HealthPage />);

    expect(screen.getByText("/health UI")).toBeInTheDocument();
    expect(screen.getByText(/healthy/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Sem chamadas a Supabase ou APIs externas/i)
    ).toBeInTheDocument();
  });
});
