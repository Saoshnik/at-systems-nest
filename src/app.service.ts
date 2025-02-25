import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface TreeNode {
    type: string;
    weight: number;
    children?: TreeNode[];
}

const adTree: TreeNode[] = [
    {
        type: 'RU',
        weight: 50,
        children: [
            {
                type: 'Push',
                weight: 70,
                children: [
                    {type: 'Push A', weight: 60},
                    {type: 'Push B', weight: 40},
                ],
            },
            {
                type: 'Monetization',
                weight: 30,
                children: [
                    {type: 'Popunder', weight: 50},
                    {type: 'Offerwall', weight: 50},
                ],
            },
        ],
    },
    {
        type: 'US',
        weight: 50,
        children: [
            {
                type: 'Push',
                weight: 60,
                children: [
                    {type: 'Push X', weight: 80},
                    {type: 'Push Y', weight: 20},
                ],
            },
            {
                type: 'Monetization',
                weight: 40,
                children: [{type: 'Subscription', weight: 100}],
            },
        ],
    },
];

@Injectable()
export class AppService {
    private readonly tree: TreeNode[];

    constructor() {
        this.tree = adTree;
    }

    private weightedRandom<T extends { weight: number }>(options: T[]): T {
        const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const opt of options) {
            rand -= opt.weight;
            if (rand <= 0) return opt;
        }
        return options[options.length - 1];
    }

    generateAdSet(queryParams: { key: string; value: string }[]): {
        adset_id: string;
        modules: { type: string; name: string }[];
    } {
        console.log(queryParams);

        console.log(this.tree);
        let foundedNodes: TreeNode[] = [];
        for (const param of queryParams) {
            const temp = this.tree.filter(node => node.type === param.value);
            // && node.name === param.key

            /*if (selectedRootNodes.length === 0) {
                throw new BadRequestException(`None of the provided values for '${param.key}' exist in the tree`);
            }*/

            foundedNodes.push(...temp);
        }

        console.log('founded');
        console.log(foundedNodes);

        const adSet: { type: string; name: string }[] = [];
        const queue: TreeNode[] = [...foundedNodes]; // Начнем с корневых узлов

        while (queue.length > 0) {
            const currentNode = queue.shift(); // Извлекаем узел из очереди

            if (!currentNode) continue;

            for (const category of currentNode.children || []) {
                if (!category.children || category.children.length === 0) continue;

                queue.push(...category.children);

                const selected = this.weightedRandom(category.children);
                adSet.push({type: category.type, name: selected.type});
            }
        }

        return {
            adset_id: randomUUID(),
            modules: adSet,
        };
    }
}
