import { useState } from 'react';
import styles from './table.module.css';
import { createStyles, Table, ScrollArea } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: -1,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    zIndex: 100,

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface IColumnTable {
    _idColumn: string,
    titleColumn : string,
    widthColumn? : string
}

interface IRowTable {
    _idColumn: string,
    valueRow?: any,
    templateRow? : any
}

interface ITableScroll {
    columnTable : Array<IColumnTable>;
    rowTable : Array<Array<IRowTable>>;
    heightTable? : number ,
    minWidthTable? : number
}

const TableScrollArea = (props: ITableScroll) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = props.rowTable.map((row, index) => {
    const dataOneRow = props.columnTable.map((col, index) => {
        const dataColumnOfRow = row.find(rowItem => rowItem._idColumn === col._idColumn)
        if(!dataColumnOfRow || (!dataColumnOfRow.valueRow && !dataColumnOfRow.templateRow)) return;

        if(dataColumnOfRow.templateRow) return { templateRow : dataColumnOfRow.templateRow }
        if(dataColumnOfRow.valueRow) return { valueRow : dataColumnOfRow.valueRow }
    })

    return (
        <tr key={index}>
            {
                dataOneRow.map((dataCol, _index) => {
                    if(dataCol?.templateRow) return <td className={styles.vertical} key={_index}>{ dataCol.templateRow}</td>
                    if(dataCol?.valueRow) return <td className={styles.vertical} key={_index} >{dataCol?.valueRow}</td>
                    return <td key={_index} />
                })
            }
        </tr>
    )
  });

  return (
    <div className={styles.wrapTable}>
        <ScrollArea sx={{ height: props.heightTable || 300 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table sx={{ minWidth: props.minWidthTable || 800 }} >
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <tr>{ props.columnTable.map((column, index) => <th key={index}><div style={{ width: column.widthColumn || 'auto' }}>{ column.titleColumn }</div></th>) }</tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    </div>
  );
}

export default TableScrollArea