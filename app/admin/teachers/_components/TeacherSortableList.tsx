"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
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
import { GripVertical, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type { Teacher } from "@/types/database";

import {
  deleteTeacherAction,
  updateTeacherOrderAction,
} from "../actions";

function SortableRow({
  teacher,
  onChanged,
}: {
  teacher: Teacher;
  onChanged: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: teacher.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!window.confirm(`${teacher.name} 강사를 삭제하시겠습니까?`)) return;
    startTransition(async () => {
      const res = await deleteTeacherAction(teacher.id);
      if (!res.ok) {
        toast.error("삭제 실패", { description: res.error });
      } else {
        toast.success("삭제되었습니다.");
        onChanged();
      }
    });
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-card border border-neutral-200 bg-white p-3"
    >
      <button
        type="button"
        aria-label="순서 변경 핸들"
        className="inline-flex h-9 w-9 cursor-grab items-center justify-center text-neutral-400 hover:text-primary"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-button bg-primary-50 text-primary">
        {teacher.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={teacher.photo_url}
            alt={`${teacher.name} 사진`}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-bold text-primary">
          {teacher.name}{" "}
          <span className="ml-1 text-[12px] font-semibold text-neutral-500">
            {teacher.subject}
          </span>
        </p>
        <p className="line-clamp-1 text-[12px] text-neutral-500">
          {teacher.bio ?? "소개 미입력"}
        </p>
      </div>
      <span
        className={`inline-flex h-6 items-center rounded-full px-2 text-[11px] font-bold ${
          teacher.is_active
            ? "bg-primary-50 text-primary"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {teacher.is_active ? "활성" : "비활성"}
      </span>
      <Button asChild size="sm" variant="ghost">
        <Link href={`/admin/teachers/${teacher.id}`}>편집</Link>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-600"
        onClick={onDelete}
        disabled={pending}
      >
        삭제
      </Button>
    </li>
  );
}

export default function TeacherSortableList({
  teachers,
}: {
  teachers: Teacher[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(teachers);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setItems(teachers);
  }, [teachers]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.order_index - b.order_index),
    [items],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = sorted.findIndex((t) => t.id === active.id);
    const newIdx = sorted.findIndex((t) => t.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const ordered = arrayMove(sorted, oldIdx, newIdx);
    const newItems = items.map((t) => {
      const idx = ordered.findIndex((o) => o.id === t.id);
      return idx === -1 ? t : { ...t, order_index: idx };
    });
    setItems(newItems);

    const updates = ordered.map((t, idx) => ({ id: t.id, order_index: idx }));
    startTransition(async () => {
      const res = await updateTeacherOrderAction(updates);
      if (!res.ok) {
        toast.error("순서 저장 실패", { description: res.error });
        setItems(teachers);
      } else {
        toast.success("순서가 저장되었습니다.");
        router.refresh();
      }
    });
  }

  return (
    <section className="space-y-2" aria-labelledby="teacher-order-heading">
      <h2
        id="teacher-order-heading"
        className="text-[16px] font-bold text-primary"
      >
        강사 노출 순서
        <span className="ml-2 text-[12px] font-semibold text-neutral-500">
          {sorted.length}명 · 드래그하여 변경
        </span>
      </h2>
      {sorted.length === 0 ? (
        <p className="rounded-card border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-500">
          등록된 강사가 없습니다.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sorted.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {sorted.map((t) => (
                <SortableRow
                  key={t.id}
                  teacher={t}
                  onChanged={() => router.refresh()}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
