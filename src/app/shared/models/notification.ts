export type NotificationApp = {
  id: string;
  title: string;
  description: string;
  date: Date;
  url?: string;
  imgurl?: string;
  seen?: boolean;
  userid?: string;
};
