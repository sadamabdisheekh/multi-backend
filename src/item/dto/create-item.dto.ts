export class AttributeNameDto {
    id: number;
    name: string;
  }
  
  export class AttributeDto {
    attribute: string;
    name: AttributeNameDto[];
  }
  
  export class VariationDto {
    id: number;
    variation: string;
    stock: number | null;
    price: number | null;
    ids: number[];
  }
  
  export class CreateItemDto {
    variation: VariationDto[];
    attributes: AttributeDto[];
  }
  