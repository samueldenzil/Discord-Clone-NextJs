'use client'

import { Plus } from 'lucide-react'

import { useModalStore } from '@/hooks/use-modal-store'

import ActionTooltip from '@/components/action-tooltip'

export default function NavigationAction() {
  const { onOpen } = useModalStore()

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          onClick={() => onOpen('createServer')}
          className="group flex items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus className="text-emerald-500 transition-all group-hover:text-white" width={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
