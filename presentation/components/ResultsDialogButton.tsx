import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface ResultsDialogButtonProps {
  isPresent: boolean;
  results: { status: string; message: string }[];
  onClose: () => void;
}

export const ResultsDialogButton = ({
  isPresent,
  results,
  onClose,
}: ResultsDialogButtonProps) => {
  const [open, setOpen] = useState(isPresent);
  useEffect(() => {
    setOpen(isPresent);
  }, [isPresent]);
  const close = () => {
    setOpen(false);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>結果</DialogTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ステータス</TableHead>
                <TableHead>メッセージ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <CircleX color="red" />
                  </TableCell>
                  <TableCell>{result.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
