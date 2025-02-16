// The import for AccountInfo is used in the component, so we keep it.
// The Metadata import is only used as a type, so we can remove it.

import AccountInfo from "@/components/AccountInfo";

export const metadata = {
  title: "SCANUE-V Account Information",
};

const Account = () => {
  return (
    <div>
      <AccountInfo />
    </div>
  );
};

export default Account;
