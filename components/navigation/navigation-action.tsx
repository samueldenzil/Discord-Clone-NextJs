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
          className="group flex justify-center items-center"
        >
          <div className="flex justify-center items-center h-12 w-12 rounded-[24px] group-hover:rounded-[16px] bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 overflow-hidden transition-all">
            <Plus className="text-emerald-500 group-hover:text-white transition-all" width={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
