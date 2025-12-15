import { useState } from 'react';

import Signin from '@components/pages/login/Signin';
import Signup from '@components/pages/login/Signup';

export default function LoginPage() {
  const [signForm, setSignForm] = useState("signin")

  if (signForm === "signin") return <Signin setSignForm={setSignForm} />
  else return <Signup setSignForm={setSignForm} />
}
