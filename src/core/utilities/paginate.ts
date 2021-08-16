/**
 * @constant
 */
export const maxItemsPerPage = 30;

/**
 * @constant
 */
export const minItemsPerPage = 10;

/**
 * A method to calculate range
 * @function
 */
export function range(start: number, end: number) {
  const accumulator: number[] = [...Array(end - start + 1)];

  return accumulator.map((_, index) => start + index);
}

export interface Options {
  total: number;
  limit: number;
  page: number;
  /**
   * @example [1, 2 , 3, ...]
   * @default true
   */
  setRange?: boolean;
}

export interface Pagination {
  items: number;
  current: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
  next: number;
  previous: number;
}

export interface Output {
  pagination: Pagination;
  offSet: number;
  range?: number[];
}

export function paginate(options: Options): Output {
  const { total, limit = minItemsPerPage, page = 1, setRange = true } = options;

  /**
   * - items
   */
  const items = Number(total);

  const totalInputIsNaN = isNaN(items);

  if (totalInputIsNaN) return null;

  /**
   * - limit
   */
  const totalPerPage = limit > maxItemsPerPage ? maxItemsPerPage : limit;

  /**
   * - pages, total pages
   */
  const pages = Math.ceil(items / totalPerPage) || 1;

  /**
   * - current page
   */
  const current = page > pages ? pages : page;

  /**
   * - Next
   * - Previous
   */
  const hasNext = current > pages;

  const hasPrevious = current < pages;

  const next = hasNext ? current + 1 : null;

  const previous = hasPrevious ? current + 1 : null;

  /**
   * - range
   */
  const calculatedRange = setRange ? range(1, pages) : null;

  /**
   * - offSet
   */
  const offSet = (current - 1) * totalPerPage;

  return {
    pagination: {
      items,
      current,
      pages,
      limit: totalPerPage,
      hasNext,
      hasPrevious,
      next,
      previous,
    },
    offSet,
    range: calculatedRange,
  };
}
