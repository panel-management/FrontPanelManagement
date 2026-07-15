<template>
  <section class="h-full w-full rounded-sm p-3 sm:p-3 bg-muted flex flex-col gap-4">
    <div class="flex flex-col gap-2 sm:p-2">
      <h2 class="text-xl sm:text-3xl font-bold">حضور و غیاب</h2>
      <span class="text-sm font-medium">مدیریت و ثبت حضور و غیاب اعضای باشگاه</span>
    </div>
    <BaseTabs :items="items" color="tertiary">
      <template #reports>
        <div class="w-full h-full flex flex-col gap-5">
          <TablePresenceAbsence />
        </div>
      </template>
      <template #attendanceRecord>
        <div class="w-full h-full p-4 bg-white flex flex-col gap-5 rounded-xl">
          <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">ثبت حضور غیاب</span>
            <p class="break-words font-medium text-sm">
              بر روی دکمه‌های وضعیت برای ثبت حضور کلیک کنید.
            </p>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full h-full"
          >
            <div
              class="flex flex-col gap-4 bg-turquoise-50 rounded-lg p-4"
              v-for="data in formData"
              :key="data.userId"
            >
              <div class="flex max-sm:flex-col max-sm:justify-center items-center gap-3">
                <div class="flex items-center justify-center size-12 rounded-full bg-muted text-xs">
                  {{ data.role }}
                </div>
                <div class="flex sm:flex-col gap-5 sm:gap-1">
                  <span class="text-sm font-semibold">{{ data.fullName }}</span>
                  <span class="text-xs w-fit" :class="[getBeltClass(data?.belt)]" v-if="data?.belt">
                    کمربند {{ data.belt }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-4 justify-between items-center w-full">
                <div class="w-full flex justify-around">
                  <UButton
                    @click="handleInstantUpdate(data.userId, AttendanceStatus.PRESENT)"
                    :color="
                      selectedStatuses[data.userId] === AttendanceStatus.PRESENT
                        ? 'neutral'
                        : 'primary'
                    "
                    :variant="
                      selectedStatuses[data.userId] === AttendanceStatus.PRESENT
                        ? 'outline'
                        : 'subtle'
                    "
                    :loading="
                      updatingIds.has(data.userId) &&
                      selectedStatuses[data.userId] === AttendanceStatus.PRESENT
                    "
                    :disabled="
                      updatingIds.has(data.userId) ||
                      selectedStatuses[data.userId] === AttendanceStatus.PRESENT
                    "
                    label="حاضر"
                    icon="clarity:success-line"
                  />
                  <UButton
                    @click="handleInstantUpdate(data.userId, AttendanceStatus.ABSENT)"
                    :color="
                      selectedStatuses[data.userId] === AttendanceStatus.ABSENT
                        ? 'neutral'
                        : 'error'
                    "
                    :variant="
                      selectedStatuses[data.userId] === AttendanceStatus.ABSENT
                        ? 'outline'
                        : 'subtle'
                    "
                    :loading="
                      updatingIds.has(data.userId) &&
                      selectedStatuses[data.userId] === AttendanceStatus.ABSENT
                    "
                    :disabled="
                      updatingIds.has(data.userId) ||
                      selectedStatuses[data.userId] === AttendanceStatus.ABSENT
                    "
                    label="غیبت"
                    icon="material-symbols:close-rounded"
                  />
                </div>
                <div class="w-full flex justify-around">
                  <UButton
                    @click="handleInstantUpdate(data.userId, AttendanceStatus.LATE)"
                    :color="
                      selectedStatuses[data.userId] === AttendanceStatus.LATE
                        ? 'neutral'
                        : 'warning'
                    "
                    :variant="
                      selectedStatuses[data.userId] === AttendanceStatus.LATE ? 'outline' : 'subtle'
                    "
                    :loading="
                      updatingIds.has(data.userId) &&
                      selectedStatuses[data.userId] === AttendanceStatus.LATE
                    "
                    :disabled="
                      updatingIds.has(data.userId) ||
                      selectedStatuses[data.userId] === AttendanceStatus.LATE
                    "
                    label="تاخیر"
                    icon="material-symbols:alarm-on-rounded"
                  />
                  <UButton
                    @click="handleInstantUpdate(data.userId, AttendanceStatus.EXCUSED)"
                    :color="
                      selectedStatuses[data.userId] === AttendanceStatus.EXCUSED
                        ? 'neutral'
                        : 'secondary'
                    "
                    :variant="
                      selectedStatuses[data.userId] === AttendanceStatus.EXCUSED
                        ? 'outline'
                        : 'subtle'
                    "
                    :loading="
                      updatingIds.has(data.userId) &&
                      selectedStatuses[data.userId] === AttendanceStatus.EXCUSED
                    "
                    :disabled="
                      updatingIds.has(data.userId) ||
                      selectedStatuses[data.userId] === AttendanceStatus.EXCUSED
                    "
                    label="موجه"
                    icon="mdi:file-document-multiple"
                  />
                </div>
              </div>
            </div>
          </div>
          <USeparator v-if="totalPage > 1" />
          <div class="flex justify-center items-center" v-if="totalPage > 1">
            <BasePagination v-model:page="page" :total="total" :limit="limit" />
          </div>
        </div>
      </template>
    </BaseTabs>
  </section>
</template>
<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui'
  import type { AcceptAttendance } from '~/models/attendance/AcceptAttendance'
  import { AttendanceStatus, type AttendanceData } from '~/models/attendance/AttendanceData'
  import { Role } from '~/models/Role'
  import {
    acceptListAttendanceService,
    getListAttendanceService,
  } from '~/services/attendance.service'

  const isLoading: Ref<boolean> = ref(false)
  const formData: Ref<AttendanceData[]> = ref([])
  const selectedStatuses = ref<Record<number, AttendanceStatus>>({})
  const updatingIds = ref<Set<number>>(new Set())
  const toastStore = useToastStore()
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const totalPage = ref(0)

  const items = [
    {
      label: 'گزارشات',
      slot: 'reports' as const,
    },
    {
      label: 'ثبت حضور و غیاب',
      slot: 'attendanceRecord' as const,
    },
  ] satisfies TabsItem[]

  async function getListAttendance() {
    isLoading.value = true
    try {
      const result = await getListAttendanceService(page.value, limit.value)
      if (result.statusCode === 200) {
        formData.value = Array.isArray(result.data) ? result.data : []
        formData.value.forEach((item) => {
          if (item.status) {
            selectedStatuses.value[item.userId] = item.status
          }
        })
        if (result.pagination) {
          total.value = result.pagination.total
          totalPage.value = result.pagination.totalPages
        }
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  async function handleInstantUpdate(studentId: number, status: AttendanceStatus) {
    if (updatingIds.value.has(studentId) || selectedStatuses.value[studentId] === status) return
    // const oldStatus = selectedStatuses.value[studentId]
    updatingIds.value.add(studentId)
    try {
      const payload: AcceptAttendance = {
        attendances: [{ studentId, status }],
      }
      const result = await acceptListAttendanceService(payload)
      if (result.statusCode === 200) {
        selectedStatuses.value[studentId] = status
        toastStore.setAlert(result.message, '', 'success', 'ep:success-filled')
      }
    } catch (error: any) {
      // selectedStatuses.value[studentId] = oldStatus
      console.log(error.message || error)
    } finally {
      updatingIds.value.delete(studentId)
    }
  }

  watch(page, getListAttendance)
  onMounted(getListAttendance)

  definePageMeta({
    middleware: ['plan-guard'],
    roles: [Role.Master],
  })

  useHead({
    title: 'مدیریت حضور و غیاب',
    meta: [
      { name: 'description', content: 'ثبت، مشاهده و مدیریت وضعیت حضور و غیاب اعضا در کلاس‌ ها.' },
    ],
  })
</script>
