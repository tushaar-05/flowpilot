import { delay } from '@/utils/helpers';
import { API_DELAYS } from '@/constants';
import noticesData from '@/data/notices.json';
import type { Notice } from '@/types';

export async function fetchNotices(): Promise<Notice[]> {
  await delay(API_DELAYS.MEDIUM);
  return noticesData as Notice[];
}

export async function createNoticeApi(notice: Notice): Promise<Notice> {
  await delay(API_DELAYS.LONG);
  return notice;
}

export async function updateNoticeApi(notice: Notice): Promise<Notice> {
  await delay(API_DELAYS.MEDIUM);
  return notice;
}

export async function deleteNoticeApi(id: string): Promise<string> {
  await delay(API_DELAYS.MEDIUM);
  return id;
}
