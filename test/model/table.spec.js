import table from '@model/table';
import { dbConfig } from '../support/config';

const Table = table(class {});

describe('src/model/table', () => {
  describe('#tableName', () => {
    it('returns pluralized snake cased name default', () => {
      class TableClass extends Table {};
      expect(TableClass.tableName).toEqual('table_classes');
    });

    it('can be overridden', () => {
      class AnotherTable extends Table { static tableName = 'the_name' };
      expect(AnotherTable.tableName).toEqual('the_name');
    });
  });
});
