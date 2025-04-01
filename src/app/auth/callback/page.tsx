// import { onAuthenticate } from "@/actions";
import { onAuthenticateUser } from "@/actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CallbackLayout = async ({ children }: Props) => {
  const authUserObj = await onAuthenticateUser();
  console.log(authUserObj);
  if (authUserObj?.status === 500 || authUserObj?.status === 400) {
    return <div>Error: Authentication failed. Please try again.</div>;
  }
  if (authUserObj?.status === 404) {
    return redirect("/auth/sign-in");
  }

  if (authUserObj?.status === 200)
    return redirect(`/dashboard/${authUserObj.data?.id as string}`);
  if (authUserObj?.status === 201) return redirect(`/auth/role-selection`);

  return <>{children}</>;
};

export default CallbackLayout;
