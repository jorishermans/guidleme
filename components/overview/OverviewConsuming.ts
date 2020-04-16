import { ConsumerDict } from "~/services/consumer.service";

export interface OverviewConsumingProps {
  data: ConsumerDict
}
export interface OverviewConsumingState {
  hasData: boolean
  data: any
  index: any
}
