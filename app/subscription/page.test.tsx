import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubscriptionPage from "./page";

describe("SubscriptionPage", () => {
  it("allows selecting a plan without backend calls", async () => {
    const user = userEvent.setup();
    render(<SubscriptionPage />);

    await user.click(screen.getByText(/Ativar Premium/i));

    expect(
      screen.getByText(/Plano Premium selecionado \(simulado\)/i)
    ).toBeInTheDocument();
  });
});
