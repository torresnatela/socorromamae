import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubscriptionPage from "./page";
import type { SessionSnapshot } from "@/src/domain/auth/session";

const mockSession: SessionSnapshot = {
  caregiverId: "test-caregiver",
  subscription: { status: "active", trialEndsAt: null, renewalAt: null },
  consentAccepted: true,
  sessionExpiresAt: new Date().toISOString()
};

const renderWithSession = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, refetchOnMount: false }
    }
  });

  queryClient.setQueryData(["session"], mockSession);

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("SubscriptionPage", () => {
  it("allows selecting a plan without backend calls", async () => {
    const user = userEvent.setup();
    renderWithSession(<SubscriptionPage />);

    await user.click(screen.getByText(/Ativar Premium/i));

    expect(
      screen.getByText(/Plano Premium selecionado \(simulado\)/i)
    ).toBeInTheDocument();
  });
});
