import { ReactNode } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface FilterOption {
	value: string;
	label: string;
}

interface FilterSelectProps {
	label: string;
	icon: ReactNode;
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	options: FilterOption[];
}

const FilterSelect = ({
	label,
	icon,
	value,
	onValueChange,
	placeholder,
	options,
}: FilterSelectProps) => {
	return (
		<div>
			<label className='text-sm font-medium mb-2 flex items-center gap-2'>
				{icon}
				{label}
			</label>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className='bg-popover z-50'>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default FilterSelect;
