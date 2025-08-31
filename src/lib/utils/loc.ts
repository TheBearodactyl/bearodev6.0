import { m } from "$lib/paraglide/messages";

export const get_route_info = (key: string): { name: string; desc: string } => {
  const localized_name = m[`titles_routes_${key}`]();
  const localized_desc = m[`descriptions_routes_${key}`]();

  return {
    name: localized_name,
    desc: localized_desc,
  };
};
