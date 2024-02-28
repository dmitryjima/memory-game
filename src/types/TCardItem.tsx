export type TCardItemType = 'numbers' | 'images';

type TCardItem = {
  id: string;
  value: string;
  type?: TCardItemType;
};

export default TCardItem;
