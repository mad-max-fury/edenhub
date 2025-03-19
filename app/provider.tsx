import { ReduxProvider } from "@/redux";

import NotificationContainer from "@/components/notifications/notificationContainer";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <NotificationContainer />
      {children}
    </ReduxProvider>
  );
};
