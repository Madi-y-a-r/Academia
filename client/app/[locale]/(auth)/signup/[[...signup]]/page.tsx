import SignUpComponent from "@/components/SignUp";
import RoleSwitch from "@/components/RoleSwitch";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* <RoleSwitch /> */}
      <SignUpComponent />
    </div>
  );
}