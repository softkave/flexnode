import { invert } from "lodash";
import { nanoid } from "nanoid";
import { FlexResourceType, Resource } from "../definitions/flexnode";
import { getTimestamp } from "./dateFns";
import { AnyObject, InvertRecord } from "./types";

export const RESOURCE_TYPE_SHORT_NAME_MAX_LEN = 7;
export const RESOURCE_TYPE_SHORT_NAME_PADDING = "0";

function padShortName(shortName: string) {
  if (shortName.length > RESOURCE_TYPE_SHORT_NAME_MAX_LEN) {
    throw new Error(
      `Resource short name is more than ${RESOURCE_TYPE_SHORT_NAME_MAX_LEN} characters`
    );
  }
  return shortName
    .padEnd(RESOURCE_TYPE_SHORT_NAME_MAX_LEN, RESOURCE_TYPE_SHORT_NAME_PADDING)
    .toLowerCase();
}

export const RESOURCE_TYPE_SHORT_NAMES: Record<FlexResourceType, string> = {
  folder: padShortName("folder"),
  section: padShortName("section"),
  node: padShortName("node"),
  changeLogItem: padShortName("logitem"),
};

export const SHORT_NAME_TO_RESOURCE_TYPE = invert(
  RESOURCE_TYPE_SHORT_NAMES
) as InvertRecord<typeof RESOURCE_TYPE_SHORT_NAMES>;

export class InvalidResourceIdError extends Error {
  name = "InvalidResourceIdError";

  constructor(message?: string) {
    super(message);
    this.message = message ?? "Invalid resource ID.";
  }
}

export function getNewId(size?: number) {
  return nanoid(size);
}

export const ID_SIZE = 21;
export const ID_SEPARATOR = "_";
export const ID_0 = "".padEnd(ID_SIZE, RESOURCE_TYPE_SHORT_NAME_PADDING);

export function getNewIdForResource(
  resourceType: FlexResourceType,
  size = ID_SIZE,
  id0 = false
) {
  let id = ID_0;
  if (!id0) {
    id = nanoid(size);
  }

  const shortName = RESOURCE_TYPE_SHORT_NAMES[resourceType];
  return `${shortName}${ID_SEPARATOR}${id}`;
}

export function isAppResourceId(resourceId: string) {
  const shortName = resourceId.slice(0, RESOURCE_TYPE_SHORT_NAME_MAX_LEN);
  if (!shortName ?? !SHORT_NAME_TO_RESOURCE_TYPE[shortName]) {
    return false;
  }
  return true;
}

export function tryGetResourceTypeFromId(
  id: string
): FlexResourceType | undefined {
  const shortName = id.slice(0, RESOURCE_TYPE_SHORT_NAME_MAX_LEN);
  const type = SHORT_NAME_TO_RESOURCE_TYPE[shortName];
  return type;
}

export function getResourceTypeFromId(id: string) {
  const type = tryGetResourceTypeFromId(id);
  if (!type) {
    throw new InvalidResourceIdError();
  }
  return type;
}

export function newResource<T extends AnyObject>(
  type: FlexResourceType,
  seed?: Omit<T, keyof Resource> & Partial<Resource>
): Resource & T {
  const createdAt = getTimestamp();
  return {
    createdAt,
    resourceId: getNewIdForResource(type),
    lastUpdatedAt: createdAt,
    ...seed,
  } as Resource & T;
}
