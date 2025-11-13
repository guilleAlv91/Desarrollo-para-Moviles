import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Licencia } from '../licencias/entities/licencia.entity';
import { Recibo } from '../recibos/entities/recibo.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Empleado, Licencia, Recibo],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;