"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { toast } from "@/components/ui/sonner";

import { updateTeacherSubjectOrderAction } from "../actions";

function SortableSubjectRow({ subject }: { subject: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subject });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-card border border-neutral-200 bg-white px-3 py-2.5"
    >
      <button
        type="button"
        aria-label={`${subject} 순서 변경`}
        className="inline-flex h-9 w-9 cursor-grab items-center justify-center text-neutral-400 hover:text-primary"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>
      <span className="text-[16px] font-black text-primary">#{subject}</span>
    </li>
  );
}

export default function TeacherSubjectSortableList({
  subjects: initialSubjects,
}: {
  subjects: string[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialSubjects);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialSubjects);
  }, [initialSubjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.indexOf(String(active.id));
    const newIdx = items.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);

    const updates = next.map((subject, order_index) => ({ subject, order_index }));
    startTransition(async () => {
      const res = await updateTeacherSubjectOrderAction(updates);
      if (!res.ok) {
        toast.error("과목 순서 저장 실패", { description: res.error });
        setItems(initialSubjects);
      } else {
        toast.success("과목 순서가 저장되었습니다.");
        router.refresh();
      }
    });
  }

  if (items.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-500">
        등록된 과목이 없습니다. 강사를 등록하면 과목이 표시됩니다.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((subject) => (
            <SortableSubjectRow key={subject} subject={subject} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
