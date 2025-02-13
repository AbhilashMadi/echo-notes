import React, { ReactNode } from "react";

interface CustomMapperProps<T> {
  data: T[];
  comp: (data: T, i: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
}

const Mapper = <T,>({
  data,
  comp,
  keyExtractor,
}: CustomMapperProps<T>): ReactNode => {
  return (
    <>
      {data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : index.toString();

        return <React.Fragment key={key}>{comp(item, index)}</React.Fragment>;
      })}
    </>
  );
};

export default Mapper;
