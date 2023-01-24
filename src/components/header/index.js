import NavBarBootstrap from "components/nav-bar";
import useAuth from "hooks/use-auth";

export default function Header() {
  const [signInWithGoogle] = useAuth();

  return (
    <div>
      <NavBarBootstrap handleAuth={signInWithGoogle}></NavBarBootstrap>
    </div>
  );
}
