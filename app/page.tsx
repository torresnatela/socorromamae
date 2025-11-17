import { redirect } from "next/navigation";

const LandingRedirect = () => {
  redirect("/login");
};

export default LandingRedirect;
