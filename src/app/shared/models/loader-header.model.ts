import { HeaderName } from '../enums/header-name.enum';

export type LoaderHeader = { [key in HeaderName]?: string };
