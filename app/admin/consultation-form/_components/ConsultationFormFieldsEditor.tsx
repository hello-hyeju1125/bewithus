"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";

import { saveConsultationFormFieldsAction } from "@/app/admin/consultation-form/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import type { ConsultationFieldAdminItem } from "@/lib/consultation/admin-fields";
import { slugifyFieldKey } from "@/lib/consultation/admin-fields";
import type { ConsultationFieldType, ConsultationFormField } from "@/types/database";

type DraftField = ConsultationFieldAdminItem & {
  clientId: string;
};

const TYPE_LABELS: Record<ConsultationFieldType, string> = {
  text: "한 줄 입력",
  tel: "전화번호",
  textarea: "여러 줄 입력",
};

function toDraft(row: ConsultationFormField): DraftField {
  return {
    clientId: row.id,
    id: row.id,
    field_key: row.field_key,
    label: row.label,
    field_type: row.field_type,
    placeholder: row.placeholder ?? "",
    is_required: row.is_required,
  };
}

function newDraft(): DraftField {
  const key = slugifyFieldKey("new_field");
  return {
    clientId: `new-${key}`,
    field_key: key,
    label: "",
    field_type: "text",
    placeholder: "",
    is_required: true,
  };
}

export default function ConsultationFormFieldsEditor({
  initialFields,
}: {
  initialFields: ConsultationFormField[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fields, setFields] = useState<DraftField[]>(() =>
    initialFields.length > 0
      ? initialFields.map(toDraft)
      : [newDraft()],
  );

  useEffect(() => {
    setFields(
      initialFields.length > 0
        ? initialFields.map(toDraft)
        : [newDraft()],
    );
  }, [initialFields]);

  function patch(clientId: string, patch: Partial<DraftField>) {
    setFields((prev) =>
      prev.map((f) => (f.clientId === clientId ? { ...f, ...patch } : f)),
    );
  }

  function move(clientId: string, direction: -1 | 1) {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.clientId === clientId);
      if (idx < 0) return prev;
      const next = idx + direction;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }

  function remove(clientId: string) {
    setFields((prev) => {
      if (prev.length <= 1) {
        toast.error("최소 1개의 항목이 필요합니다.");
        return prev;
      }
      return prev.filter((f) => f.clientId !== clientId);
    });
  }

  function onSave() {
    const payload = fields.map(({ clientId: _c, ...rest }) => rest);
    startTransition(async () => {
      const result = await saveConsultationFormFieldsAction(
        JSON.stringify({ fields: payload }),
      );
      if (result.ok) {
        toast.success("상담 신청 양식이 저장되었습니다.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <p className="text-[14px] leading-relaxed text-neutral-600">
        헤더 「상담 신청」 모달에 표시되는 항목입니다. 제목·입력 형식·필수 여부를
        설정하고, 순서는 위·아래 버튼으로 변경할 수 있습니다.
      </p>

      <ul className="space-y-4">
        {fields.map((field, index) => (
          <li
            key={field.clientId}
            className="rounded-card border border-neutral-200 bg-white p-5 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-black text-primary">
                항목 {index + 1}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={index === 0 || pending}
                  onClick={() => move(field.clientId, -1)}
                  aria-label="위로 이동"
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={index === fields.length - 1 || pending}
                  onClick={() => move(field.clientId, 1)}
                  aria-label="아래로 이동"
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-red-600 hover:text-red-700"
                  disabled={fields.length <= 1 || pending}
                  onClick={() => remove(field.clientId)}
                  aria-label="항목 삭제"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`label-${field.clientId}`}>항목 제목</Label>
                <Input
                  id={`label-${field.clientId}`}
                  value={field.label}
                  onChange={(e) =>
                    patch(field.clientId, { label: e.target.value })
                  }
                  placeholder="예: 학생 이름"
                  maxLength={80}
                  disabled={pending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`type-${field.clientId}`}>입력 형식</Label>
                <Select
                  value={field.field_type}
                  onValueChange={(value: ConsultationFieldType) =>
                    patch(field.clientId, { field_type: value })
                  }
                  disabled={pending}
                >
                  <SelectTrigger id={`type-${field.clientId}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TYPE_LABELS) as ConsultationFieldType[]).map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {TYPE_LABELS[type]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`placeholder-${field.clientId}`}>
                  안내 문구 (선택)
                </Label>
                <Input
                  id={`placeholder-${field.clientId}`}
                  value={field.placeholder ?? ""}
                  onChange={(e) =>
                    patch(field.clientId, { placeholder: e.target.value })
                  }
                  placeholder="입력란에 표시할 힌트"
                  maxLength={120}
                  disabled={pending}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-button border border-neutral-100 bg-neutral-50 px-4 py-3 sm:col-span-2">
                <div>
                  <p className="text-[14px] font-semibold text-neutral-800">
                    필수 입력
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    끄면 선택 입력으로 표시됩니다.
                  </p>
                </div>
                <Switch
                  checked={field.is_required}
                  disabled={pending}
                  onCheckedChange={(checked) =>
                    patch(field.clientId, { is_required: checked })
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        disabled={pending || fields.length >= 20}
        onClick={() => setFields((prev) => [...prev, newDraft()])}
      >
        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
        항목 추가
      </Button>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="min-w-[120px]"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              저장 중…
            </>
          ) : (
            "저장"
          )}
        </Button>
      </div>
    </div>
  );
}
